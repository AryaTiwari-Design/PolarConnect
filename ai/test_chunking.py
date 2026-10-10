import unittest

from chunking import chunk_pages


class ChunkingTests(unittest.TestCase):
    def test_chunks_page_text_with_page_number(self):
        pages = [{"page": 1, "text": "A" * 1400}]

        chunks = chunk_pages(pages, chunk_size=500, overlap=100)

        self.assertGreater(len(chunks), 1)
        self.assertEqual(chunks[0]["page"], 1)
        self.assertLessEqual(len(chunks[0]["text"]), 500)


if __name__ == "__main__":
    unittest.main()
