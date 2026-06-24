import os
import re

content_dir = "/workspaces/examarchive-syllabus/content"

for filename in os.listdir(content_dir):
    if not filename.startswith("CHM") or not filename.endswith(".md"):
        continue
        
    filepath = os.path.join(content_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Extract title to determine T or P
    title_match = re.search(r'paper_title:\s*"(.*?)"', content)
    paper_title = title_match.group(1) if title_match else ""
    
    is_practical = "practical" in paper_title.lower()
    suffix = "P" if is_practical else "T"
    
    # Extract original paper code from the frontmatter
    code_match = re.search(r'paper_code:\s*"(.*?)"', content)
    if not code_match:
        continue
        
    orig_code = code_match.group(1)
    
    # Clean the code: remove dashes, spaces, and append suffix
    clean_code = orig_code.replace("-", "").replace(" ", "")
    # Sometimes OCR puts a space, so clean it
    new_code = clean_code + suffix
    
    # Check if the code is valid according to the regex
    regex = re.compile(r'^([A-Z]{3})(DSC|DSM|SEC|IDC|AEC|VAC)(10[1-9]|15[1-9]|20[1-9]|25[1-9]|30[1-9]|35[1-9]|40[1-9]|45[1-9])[ABC]?[TP]$')
    if not regex.match(new_code):
        print(f"Warning: {new_code} generated from {orig_code} does not match regex!")
        
    # Update content
    content = re.sub(r'paper_code:\s*".*?"', f'paper_code: "{new_code}"', content)
    content = re.sub(r'entry_id:\s*".*?"', f'entry_id: "{new_code}"', content)
    
    # We write back the corrected content
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    # Rename the file
    new_filename = f"{new_code}-syllabus.md"
    new_filepath = os.path.join(content_dir, new_filename)
    
    if filepath != new_filepath:
        os.rename(filepath, new_filepath)
        print(f"Renamed {filename} -> {new_filename}")

