from pathlib import Path
import unittest

from extraction import extract_text_from_pdf


PDF_PATH = Path(__file__).resolve().parents[1] / "research_docs" / "approved" / "Antarctic_factsheet.pdf"


class ExtractionTests(unittest.TestCase):
    def test_extracts_pages_from_approved_pdf(self):
        pages = extract_text_from_pdf(PDF_PATH)

        self.assertGreater(len(pages), 0)
        self.assertIn("page", pages[0])
        self.assertIn("text", pages[0])
        self.assertTrue(pages[0]["text"].strip())


if __name__ == "__main__":
    unittest.main()
