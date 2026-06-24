import os
import re
import datetime
import PyPDF2

def parse_pdf(pdf_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

    # Fix some common OCR/extraction issues
    text = text.replace('Course No.:', 'Course No.:')
    
    # Split text by Course No.
    courses = re.split(r'Course No\.\s*:\s*', text)
    
    # Skip the first chunk as it's the index/header
    for i in range(1, len(courses)):
        chunk = courses[i]
        
        # Extract paper code
        lines = [line.strip() for line in chunk.split('\n') if line.strip()]
        paper_code = lines[0].strip()
        
        if not paper_code.startswith('CHM'):
            # try to extract from the first word
            match = re.match(r'([A-Z]{3}-[A-Z]{3,4}-\d{3}[A-Z]?)', paper_code)
            if match:
                paper_code = match.group(1)
            else:
                continue
                
        # Parse basic fields
        semester_match = re.search(r'\(?(\d)(st|nd|rd|th)\s*Semester\)?', chunk, re.IGNORECASE)
        semester_no = int(semester_match.group(1)) if semester_match else 0
        
        credit_match = re.search(r'Credits?:\s*(\d+)', chunk, re.IGNORECASE)
        credits = int(credit_match.group(1)) if credit_match else 0
        
        marks_match = re.search(r'Full Marks\s*=\s*(\d+)', chunk, re.IGNORECASE)
        marks_total = int(marks_match.group(1)) if marks_match else 100
        
        # Title is usually the next few lines before "Contact Hours" or "Full Marks"
        title_lines = []
        for line in lines[1:5]:
            if 'Contact Hours' in line or 'Full Marks' in line or 'Credits' in line or 'Examination Time' in line:
                break
            # Remove parenthesis from titles
            clean_line = line.replace('(', '').replace(')', '').strip()
            if clean_line:
                title_lines.append(clean_line)
                
        paper_title = " - ".join(title_lines)
        if not paper_title:
            paper_title = "Chemistry Paper"
            
        parts = paper_code.split('-')
        subject_code = parts[0] if len(parts) > 0 else 'CHM'
        paper_type = parts[1] if len(parts) > 1 else 'DSC'
        semester_code = parts[2] if len(parts) > 2 else '000'
        
        entry_id = paper_code
        
        # Extract Units
        # Find all occurrences of UNIT-1, UNIT-I, Unit 1, Unit I, etc.
        unit_pattern = re.compile(r'(?:UNIT|Unit|SECTION|Section)[\s\-]*([IVX\d]+)[\:\.]?\s*(.*?)(?=(?:UNIT|Unit|SECTION|Section)[\s\-]*[IVX\d]+[\:\.]|Reference Books|Suggested Readings|Internal Assessment|$)', re.IGNORECASE | re.DOTALL)
        
        units = []
        # Find where syllabus starts (after marks)
        syllabus_start = 0
        marks_pos = re.search(r'Pass Marks.*?\n', chunk, re.IGNORECASE)
        if marks_pos:
            syllabus_start = marks_pos.end()
            
        syllabus_text = chunk[syllabus_start:]
        
        for m in unit_pattern.finditer(syllabus_text):
            u_num = m.group(1).strip()
            u_content = m.group(2).strip()
            
            # extract unit title if present (usually first line)
            u_content_lines = u_content.split('\n')
            
            if u_content_lines:
                # clean up newlines to make it one paragraph per section or just keep as is
                u_clean = u_content.replace('\n', ' ').replace('  ', ' ')
                # approximate lectures
                lectures = max(1, credits * 15 // 5) if credits > 0 else 9
                tags = "chemistry"
                
                # convert roman to arabic
                roman_map = {'I': '1', 'II': '2', 'III': '3', 'IV': '4', 'V': '5', 'A': 'A', 'B': 'B', 'C': 'C'}
                if u_num.upper() in roman_map:
                    u_num = roman_map[u_num.upper()]
                    
                units.append((u_num, u_clean, lectures, tags))
                
        # Write to Markdown
        md_content = f"""---
entry_type: syllabus
entry_id: "{entry_id}"
university: "Assam University"
course: "FYUG"
stream: "Science"
paper_code: "{paper_code}"
paper_title: "{paper_title}"
subject_code: "{subject_code}"
paper_type: "{paper_type}"
semester_code: "{semester_code}"
semester_no: {semester_no}
credits: {credits}
marks_total: {marks_total}
syllabus_pdf_url: ""
source_reference: "CHEMISTRY.pdf"
status: "draft"
version: 1
last_updated: "{datetime.datetime.now().strftime('%Y-%m-%d')}"
---

## Syllabus

| unit_number | syllabus_content | lectures | tags |
|---|---|---|---|
"""
        for u in units:
            md_content += f"| {u[0]} | {u[1]} | {u[2]} | {u[3]} |\n"
            
        out_path = os.path.join(output_dir, f"{paper_code}-syllabus.md")
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
            
        print(f"Generated {out_path}")

if __name__ == '__main__':
    pdf_path = "/workspaces/examarchive-syllabus/public/docs/SYLLABUS PDF/CHEMISTRY.pdf"
    output_dir = "/workspaces/examarchive-syllabus/content"
    
    try:
        import PyPDF2
    except ImportError:
        os.system("pip install PyPDF2")
        import PyPDF2
        
    parse_pdf(pdf_path, output_dir)

