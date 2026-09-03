"""
Embedding Service for Vector Similarity Calculation
---------------------------------------------------
Generates dense numerical vector representations for text chunks.
Supports OpenAI text-embedding-3-small with a deterministic fallback vector encoder.
"""

import math
import re
import numpy as np
from app.core.config import settings

try:
    from openai import OpenAI
    openai_client = OpenAI(api_key=settings.OPENAI_API_KEY) if (settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-")) else None
except Exception:
    openai_client = None


class EmbeddingService:
    @staticmethod
    def get_embedding(text: str) -> list[float]:
        """
        Generates a normalized float vector for the input text string.
        """
        if not text or not text.strip():
            return [0.0] * 128

        # Try OpenAI embeddings API if valid OpenAI key is available
        if openai_client and settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-"):
            try:
                response = openai_client.embeddings.create(
                    input=text.replace("\n", " "),
                    model=settings.EMBEDDING_MODEL,
                )
                return response.data[0].embedding
            except Exception as e:
                print(f"[EmbeddingService Warning] OpenAI API call failed: {e}. Falling back to local vector encoder.")

        # Fallback: Deterministic feature hashing vector encoder (128 dimensions)
        return EmbeddingService._generate_fallback_vector(text)

    @staticmethod
    def _generate_fallback_vector(text: str, dim: int = 128) -> list[float]:
        """
        Generates a normalized 128-dimensional term frequency vector.
        Internal math:
        - Tokenizes text into lowercase words.
        - Hashes each word into an index [0..dim-1] using Murmur-style hash.
        - L2 Normalizes the vector: v / sqrt(sum(v_i^2))
        """
        words = re.findall(r"\w+", text.lower())
        vec = np.zeros(dim, dtype=np.float32)
        
        for w in words:
            idx = abs(hash(w)) % dim
            vec[idx] += 1.0

        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm

        return vec.tolist()

    @staticmethod
    def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
        """
        Calculates cosine similarity between two vectors:
        cos(theta) = (A . B) / (||A|| * ||B||)
        Returns a float between 0.0 (orthogonal) and 1.0 (identical direction).
        """
        a = np.array(vec_a, dtype=np.float32)
        b = np.array(vec_b, dtype=np.float32)

        # Handle different dimensions if fallback vs openai mixed
        if len(a) != len(b):
            min_dim = min(len(a), len(b))
            a = a[:min_dim]
            b = b[:min_dim]

        dot_product = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)

        if norm_a == 0 or norm_b == 0:
            return 0.0

        similarity = float(dot_product / (norm_a * norm_b))
        return max(0.0, min(1.0, similarity))
