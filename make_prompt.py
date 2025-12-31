import os
import fnmatch

# ================= CONFIGURATION =================
# Name of the output file
OUTPUT_FILE = 'prompt.txt'

# List of files, folder names, or extensions to IGNORE.
# You can use wildcards (e.g., '*.png', '*.pyc')
IGNORE_PATTERNS = [
    # System / Git
    '.git',
    '.gitignore',
    '.DS_Store','Guide','test','target','Cargo.lock','data',"Guide","1.sql",
    
    # Python specific
    '__pycache__',
    'venv',
    '.env',
    '*.pyc',
    
    # Node/JS specific
    'node_modules',
    '.next',
    'package-lock.json',
    
    # Media/Binary files (Optional, but recommended to keep prompt small)
    '*.png',
    '*.jpg',
    '*.jpeg',
    '*.gif',
    '*.ico',
    '*.svg',
    '*.mp4',
    '*.mp3',
    '*.wav',
    '*.pdf',
    '*.zip',
    '*.tar.gz',
    '*.exe',
    '*.dll',
    '*.class',
    '*.jar',
    
    # The script itself and the output file
    'make_prompt.py', 
    OUTPUT_FILE
]
# =================================================

def is_ignored(path, names_to_ignore):
    """
    Checks if a path matches any of the ignore patterns.
    """
    for pattern in names_to_ignore:
        if fnmatch.fnmatch(path, pattern) or fnmatch.fnmatch(os.path.basename(path), pattern):
            return True
    return False

def is_binary(file_path):
    """
    Simple check to see if a file is binary (non-text).
    Reads a small chunk to check for null bytes.
    """
    try:
        with open(file_path, 'rb') as f:
            chunk = f.read(1024)
            if b'\0' in chunk:
                return True
    except Exception:
        return True
    return False

def generate_prompt_file():
    root_dir = os.getcwd() # Get current directory
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        
        # Walk through the directory tree
        for dirpath, dirnames, filenames in os.walk(root_dir):
            
            # 1. FILTER FOLDERS IN-PLACE
            # We modify 'dirnames' list to prevent os.walk from entering ignored folders
            # This is more efficient than checking them later
            dirnames[:] = [d for d in dirnames if not is_ignored(d, IGNORE_PATTERNS)]

            for filename in filenames:
                file_path = os.path.join(dirpath, filename)
                relative_path = os.path.relpath(file_path, root_dir)

                # 2. FILTER FILES
                if is_ignored(filename, IGNORE_PATTERNS):
                    continue

                # 3. CHECK IF BINARY
                if is_binary(file_path):
                    print(f"Skipping binary file: {relative_path}")
                    continue

                # 4. WRITE TO PROMPT.TXT
                try:
                    print(f"Processing: {relative_path}")
                    
                    # Create a clearly visible header for the LLM
                    outfile.write(f"\n{'='*20}\n")
                    outfile.write(f"FILE PATH: {relative_path}\n")
                    outfile.write(f"{'='*20}\n\n")
                    
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                        content = infile.read()
                        outfile.write(content)
                        outfile.write("\n") # Ensure separation between files
                        
                except Exception as e:
                    print(f"Error reading {relative_path}: {e}")

    print(f"\nDone! All files merged into {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_prompt_file()