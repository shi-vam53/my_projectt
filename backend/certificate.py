"""Praxis Certificate of Workplace Readiness Generator (ReportLab Platypus / Canvas).

Generates official, landscape-oriented, publication-grade completion certificates
for learners who complete their career track milestones.
"""

from pathlib import Path
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.pdfgen import canvas


def generate_certificate_pdf(
    output_path: Path,
    learner_name: str,
    role_title: str,
    cert_id: str,
    date_str: str,
) -> Path:
    """Generate an official landscape Certificate of Completion PDF."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output_path), pagesize=landscape(letter))
    width, height = landscape(letter)  # 792 x 612 pt

    # Outer decorative navy border
    c.setStrokeColor(colors.HexColor("#1e3a8a"))
    c.setLineWidth(5)
    c.rect(28, 28, width - 56, height - 56)

    # Inner gold accent border
    c.setStrokeColor(colors.HexColor("#d97706"))
    c.setLineWidth(1.5)
    c.rect(36, 36, width - 72, height - 72)

    # Header brand
    c.setFillColor(colors.HexColor("#0f172a"))
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2, height - 85, "PRAXIS WORKPLACE SIMULATION PLATFORM")

    c.setFont("Helvetica", 9.5)
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawCentredString(
        width / 2, height - 105, "OFFICIAL VERIFICATION OF TECHNICAL WORKPLACE READINESS"
    )

    # Main Certificate Title
    c.setFont("Times-BoldItalic", 28)
    c.setFillColor(colors.HexColor("#1e40af"))
    c.drawCentredString(width / 2, height - 155, "Certificate of Completion")

    c.setFont("Helvetica", 11.5)
    c.setFillColor(colors.HexColor("#334155"))
    c.drawCentredString(width / 2, height - 195, "This official credential certifies that")

    # Learner Name
    c.setFont("Helvetica-Bold", 26)
    c.setFillColor(colors.HexColor("#0f172a"))
    c.drawCentredString(width / 2, height - 240, learner_name)

    # Divider line under name
    c.setStrokeColor(colors.HexColor("#cbd5e1"))
    c.setLineWidth(1)
    c.line(width / 2 - 180, height - 250, width / 2 + 180, height - 250)

    # Body statement
    c.setFont("Helvetica", 11)
    c.setFillColor(colors.HexColor("#475569"))
    c.drawCentredString(
        width / 2,
        height - 275,
        "has demonstrated verified practical technical proficiency and operational readiness in the specialization of",
    )

    # Role Title
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(colors.HexColor("#15803d"))  # Emerald
    c.drawCentredString(width / 2, height - 310, role_title)

    # Narrative details
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawCentredString(
        width / 2,
        height - 345,
        "Having mastered the 12-page role handbook curriculum, passed the 5-question readiness evaluation,",
    )
    c.drawCentredString(
        width / 2,
        height - 360,
        "and successfully executed hands-on engineering incident triage and production problem challenges.",
    )

    # Golden verification medallion
    c.setStrokeColor(colors.HexColor("#d97706"))
    c.setFillColor(colors.HexColor("#fef3c7"))
    c.circle(width / 2, height - 435, 34, fill=1, stroke=1)
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(colors.HexColor("#92400e"))
    c.drawCentredString(width / 2, height - 430, "PRAXIS")
    c.drawCentredString(width / 2, height - 442, "VERIFIED")

    # Signatures
    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(colors.HexColor("#1e293b"))
    c.drawString(95, height - 475, "Director of Technical Curriculum")
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.setLineWidth(0.8)
    c.line(95, height - 460, 275, height - 460)

    c.drawRightString(width - 95, height - 475, "Staff Operations Verification")
    c.line(width - 275, height - 460, width - 95, height - 460)

    # Footer metadata
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor("#94a3b8"))
    c.drawString(45, 45, f"Certificate ID: {cert_id}")
    c.drawRightString(
        width - 45,
        45,
        f"Issued: {date_str} | Online Verification: https://shi-vam53.github.io/my_projectt/",
    )

    c.save()
    return output_path
