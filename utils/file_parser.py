from pathlib import Path
from pypdf import PdfReader
from docx import Document


class FileParser:

    @staticmethod
    def extract_text(file_path: str) -> str:
        extension = Path(file_path).suffix.lower()

        if extension == ".txt":
            return FileParser._read_txt(file_path)

        elif extension == ".pdf":
            return FileParser._read_pdf(file_path)

        elif extension == ".docx":
            return FileParser._read_docx(file_path)

        raise ValueError("Unsupported file type.")

    @staticmethod
    def _read_txt(file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()

    @staticmethod
    def _read_pdf(file_path: str) -> str:
        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""

        return text

    @staticmethod
    def _read_docx(file_path: str) -> str:
        document = Document(file_path)

        text = "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

        return text