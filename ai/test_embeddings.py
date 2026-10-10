import importlib.util
import unittest


@unittest.skipIf(importlib.util.find_spec("sentence_transformers") is None, "sentence_transformers is optional")
class EmbeddingTests(unittest.TestCase):
    def test_creates_one_embedding_per_text(self):
        from embeddings import create_embeddings

        texts = ["Antarctica is important for climate science.", "Maitri is an Indian Antarctic station."]

        embeddings = create_embeddings(texts)

        self.assertEqual(len(embeddings), len(texts))
        self.assertGreater(len(embeddings[0]), 0)


if __name__ == "__main__":
    unittest.main()
