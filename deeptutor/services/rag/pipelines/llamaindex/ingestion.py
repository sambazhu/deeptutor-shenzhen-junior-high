"""LlamaIndex ingestion helpers.

This module keeps DeepTutor's indexing path thin by delegating parsing
transformations and embedding to LlamaIndex's official IngestionPipeline.
"""

from __future__ import annotations

from pathlib import Path
import re
from typing import Any

from llama_index.core import Document, Settings, VectorStoreIndex
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import BaseNode

from . import vector_store
from .config import should_show_progress, vector_index_config_from_settings
from .embedding_adapter import current_embedding

_HEADER_SPLIT_RE = re.compile(r"(?m)^(?=###\s*【|##\s+)")


class TextbookHeaderBridgeSplitter(SentenceSplitter):
    """Page/section-boundary-aware splitter that preserves textbook headers and
    bridges cross-page sentence breaks.

    1. Splits Markdown documents at ``### 【...】`` (page anchors) and ``## ...``
       (section headers) first so chunks never mix unrelated pages.
    2. Carries a 150-char ``[承上页]`` tail bridge across consecutive page
       anchors so a theorem introduced at the bottom of page N-1 stays attached
       to the worked example at the top of page N.
    3. When a single page/section exceeds ``chunk_size`` and is split into
       multiple sub-chunks, prepends the ``### 【...】`` / ``## ...`` header to
       every sub-chunk so 100% of chunks retain their exact book/page/chapter
       identity.
    """

    def split_text_metadata_aware(self, text: str, metadata_str: str) -> list[str]:
        if "### 【" not in text and "\n## " not in text:
            return super().split_text_metadata_aware(text, metadata_str)

        sections = [s.strip() for s in _HEADER_SPLIT_RE.split(text) if s.strip()]
        if len(sections) <= 1:
            return super().split_text_metadata_aware(text, metadata_str)

        final_chunks: list[str] = []
        prev_body_tail = ""

        for sec in sections:
            parts = sec.split("\n", 1)
            first_line = parts[0].strip()
            body = parts[1].strip() if len(parts) > 1 else ""
            is_page_sec = first_line.startswith("### 【")
            is_sec_hdr = is_page_sec or first_line.startswith("## ")

            if is_page_sec and prev_body_tail:
                bridged_sec = f"{first_line}\n[承上页] {prev_body_tail}\n\n{body}"
            else:
                bridged_sec = sec

            if is_page_sec and body:
                prev_body_tail = re.sub(r"\s+", " ", body)[-150:].strip()
            elif not is_page_sec:
                prev_body_tail = ""

            sub_splits = super().split_text_metadata_aware(bridged_sec, metadata_str)
            for idx, st in enumerate(sub_splits):
                st = st.strip()
                if not st:
                    continue
                if idx > 0 and is_sec_hdr and not st.startswith(first_line):
                    st = f"{first_line}\n\n{st}"
                final_chunks.append(st)

        return final_chunks or super().split_text_metadata_aware(text, metadata_str)


def build_ingestion_pipeline() -> IngestionPipeline:
    """Create the default DeepTutor ingestion pipeline.

    The embedding step uses ``Settings.embed_model``, which is configured by
    ``embedding_adapter.configure_llamaindex_settings`` to call DeepTutor's
    configured embedding service rather than any local model.
    """

    return IngestionPipeline(
        transformations=[
            TextbookHeaderBridgeSplitter(
                chunk_size=Settings.chunk_size,
                chunk_overlap=Settings.chunk_overlap,
            ),
            current_embedding(),
        ],
    )


def _has_precomputed_embedding(document: Any) -> bool:
    """Return True only for non-Document nodes that already carry a vector.

    LlamaIndex's ``Document`` class inherits from ``BaseNode``, so a naive
    ``isinstance(doc, BaseNode)`` check incorrectly classifies every Document
    as pre-embedded, bypassing the chunking pipeline entirely. This helper
    distinguishes genuinely pre-embedded nodes (e.g. ImageNode produced by
    multimodal loaders) from regular Documents that still need splitting and
    embedding. The embedding may be a list or a numpy array, so we check
    ``len(...) > 0`` rather than ``bool(...)`` (ambiguous for ndarrays).
    """
    if isinstance(document, Document):
        return False
    if not isinstance(document, BaseNode):
        return False
    embedding = getattr(document, "embedding", None)
    if embedding is None:
        return False
    try:
        return len(embedding) > 0
    except TypeError:
        return True


def documents_to_nodes(documents: list[Any], *, show_progress: bool | None = None) -> list[Any]:
    """Convert LlamaIndex documents into embedded nodes.

    Pre-embedded nodes, such as ImageNode instances produced by the document
    loader, pass through unchanged so they are not re-embedded as text.

    ``show_progress=None`` resolves the tqdm decision at call time. It must not
    be a default-argument call: Python evaluates those once at import, which
    would freeze whatever ``sys.stdout`` happened to be when the module first
    loaded.
    """
    if show_progress is None:
        show_progress = should_show_progress()
    text_documents = [
        document for document in documents if not _has_precomputed_embedding(document)
    ]
    preembedded_nodes = [document for document in documents if _has_precomputed_embedding(document)]

    nodes: list[Any] = []
    if text_documents:
        pipeline = build_ingestion_pipeline()
        nodes.extend(pipeline.run(documents=text_documents, show_progress=show_progress))
    nodes.extend(preembedded_nodes)
    return nodes


def create_index_from_documents(
    documents: list[Any], storage_dir: Path, *, show_progress: bool | None = None
) -> tuple[VectorStoreIndex, int]:
    """Create and persist a VectorStoreIndex from documents.

    Uses a FAISS-backed store when available and all node embeddings share one
    dimension; otherwise LlamaIndex's default SimpleVectorStore.
    """
    if show_progress is None:
        show_progress = should_show_progress()
    nodes = documents_to_nodes(documents, show_progress=show_progress)
    storage_context = vector_store.storage_context_for_nodes(
        nodes, vector_index_config_from_settings()
    )
    index = VectorStoreIndex(
        nodes=nodes,
        storage_context=storage_context,
        show_progress=show_progress,
        embed_model=current_embedding(),
    )
    index.storage_context.persist(persist_dir=str(storage_dir))
    return index, len(documents)


def insert_documents_into_index(
    index: Any, documents: list[Any], *, show_progress: bool | None = None
) -> int:
    """Transform documents once, then insert nodes into an existing index."""
    nodes = documents_to_nodes(documents, show_progress=show_progress)
    index.insert_nodes(nodes)
    return len(documents)


__all__ = [
    "build_ingestion_pipeline",
    "create_index_from_documents",
    "documents_to_nodes",
    "insert_documents_into_index",
]
