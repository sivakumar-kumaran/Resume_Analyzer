"""
Vector Store Implementation (FAISS / Memory-backed Vector Index)
---------------------------------------------------------------
This component splits text into chunks, generates vector embeddings, stores them,
and performs top-K cosine similarity retrieval for RAG (Retrieval-Augmented Generation).
"""

from typing import List, Dict, Any
from app.services.embedding_service import EmbeddingService


class VectorStore:
    def __init__(self):
        # In-memory document storage: [{ "id": int, "text": str, "vector": list[float], "metadata": dict }]
        self.documents: List[Dict[str, Any]] = []

    def chunk_text(self, text: str, chunk_size: int = 300, overlap: int = 50) -> List[str]:
        """
        Splits a text document into overlapping chunks to preserve semantic context across boundaries.
        """
        if not text:
            return []

        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        chunks = []

        for p in paragraphs:
            if len(p) <= chunk_size:
                chunks.append(p)
            else:
                words = p.split()
                current_chunk = []
                current_len = 0
                for w in words:
                    current_chunk.append(w)
                    current_len += len(w) + 1
                    if current_len >= chunk_size:
                        chunks.append(" ".join(current_chunk))
                        # Create overlap by keeping last few words
                        overlap_words = current_chunk[-10:] if len(current_chunk) > 10 else []
                        current_chunk = overlap_words
                        current_len = sum(len(x) + 1 for x in overlap_words)

                if current_chunk:
                    chunks.append(" ".join(current_chunk))

        return chunks if chunks else [text]

    def add_documents(self, text: str, source_label: str) -> None:
        """
        Chunks raw text, embeds each chunk into a vector, and indexes it.
        """
        chunks = self.chunk_text(text)
        for i, chunk in enumerate(chunks):
            embedding = EmbeddingService.get_embedding(chunk)
            doc_entry = {
                "id": len(self.documents),
                "text": chunk,
                "vector": embedding,
                "metadata": {"source": source_label, "chunk_index": i},
            }
            self.documents.append(doc_entry)

    def similarity_search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Converts query to vector embedding, computes cosine similarity against all stored chunks,
        and returns the top-K highest scoring chunks.
        """
        if not self.documents:
            return []

        query_vector = EmbeddingService.get_embedding(query)
        results = []

        for doc in self.documents:
            score = EmbeddingService.cosine_similarity(query_vector, doc["vector"])
            results.append({
                "text": doc["text"],
                "score": round(score, 4),
                "source": doc["metadata"]["source"],
            })

        # Sort by similarity score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def clear(self) -> None:
        """Clears all indexed vector documents."""
        self.documents.clear()
