from io import BytesIO
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from app.database.db import connection

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/generate")
def generate_report(location: str | None = None):
    sql = "SELECT observation_date, location, temperature_c, wind_speed_m_s, source FROM polar_data"
    params = []
    if location:
        sql += " WHERE location LIKE ?"
        params.append(f"%{location}%")
    sql += " ORDER BY observation_date DESC LIMIT 100"
    with connection() as conn:
        rows = conn.execute(sql, params).fetchall()
    if not rows:
        raise HTTPException(status_code=404, detail="No data is available to include in a report.")
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 55
    pdf.setTitle("Polar Connect Data Report")
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(45, y, "Polar Connect - Data Report")
    y -= 25
    pdf.setFont("Helvetica", 9)
    pdf.drawString(45, y, "Demo records are illustrative; verify data provenance before scientific use.")
    y -= 30
    pdf.setFont("Helvetica-Bold", 9)
    for x, label in [(45, "Date"), (120, "Location"), (285, "Temp (C)"), (355, "Wind (m/s)"), (440, "Source")]:
        pdf.drawString(x, y, label)
    y -= 15
    pdf.setFont("Helvetica", 8)
    for row in rows:
        if y < 55:
            pdf.showPage()
            y = height - 50
            pdf.setFont("Helvetica", 8)
        vals = [str(row["observation_date"])[:10], str(row["location"])[:25],
                "-" if row["temperature_c"] is None else str(row["temperature_c"]),
                "-" if row["wind_speed_m_s"] is None else str(row["wind_speed_m_s"]),
                str(row["source"])[:22]]
        for x, value in zip([45, 120, 285, 355, 440], vals):
            pdf.drawString(x, y, value)
        y -= 13
    pdf.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="polar_connect_report.pdf"'})
