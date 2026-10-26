import os
import shutil

primary_root = "/Users/niharikaporwal/Desktop/Hotel pro Project "
source_dir = os.path.join(primary_root, "docs/word_documents")

phase_mapping = {
    "01_Empathy_Map_Canvas.docx": "Phase-1-Ideation",
    "02_Define_Problem_Statements.docx": "Phase-1-Ideation",
    "03_Brainstorm_and_Idea_Prioritization.docx": "Phase-1-Ideation",
    "04_Project_Planning_and_Sprint_Schedule.docx": "Phase-2-Planning",
    "05_Solution_Requirements_Functional_and_NonFunctional.docx": "Phase-3-Requirements",
    "06_Technology_Stack_and_Architecture.docx": "Phase-3-Requirements",
    "07_Data_Flow_Diagrams_and_User_Stories.docx": "Phase-3-Requirements",
    "08_Problem_Solution_Fit.docx": "Phase-4-Design",
    "09_Proposed_Solution.docx": "Phase-4-Design",
    "10_Solution_Architecture.docx": "Phase-4-Design",
    "11_User_Acceptance_Testing_UAT.docx": "Phase-5-Testing",
}

docx_files = [f for f in os.listdir(source_dir) if f.endswith('.docx')]

roots_to_sync = [
    "/Users/niharikaporwal/Desktop/Hotel pro Project ",
    "/Users/niharikaporwal/Desktop/HotelPro",
    "/Users/niharikaporwal/hotel Pro Project "
]

for root in roots_to_sync:
    if not os.path.exists(root):
        continue
    print(f"\nPopulating in: {root}")
    
    # 1. Root folders to create
    # "docx", ".docx", "docx format documents"
    target_folders = [
        os.path.join(root, "docx"),
        os.path.join(root, ".docx"),
        os.path.join(root, "docx format documents"),
        os.path.join(root, "documents/docx"),
        os.path.join(root, "documents/.docx"),
        os.path.join(root, "documents/docx format documents"),
        os.path.join(root, "documents/word_documents")
    ]
    
    for tf in target_folders:
        os.makedirs(tf, exist_ok=True)
        # copy all flat docx files directly into folder
        for doc_file in docx_files:
            src = os.path.join(source_dir, doc_file)
            dst = os.path.join(tf, doc_file)
            shutil.copy2(src, dst)
        
        # also copy phased structure inside target folder
        for doc_file, phase in phase_mapping.items():
            phase_dir = os.path.join(tf, phase)
            os.makedirs(phase_dir, exist_ok=True)
            src = os.path.join(source_dir, doc_file)
            dst = os.path.join(phase_dir, doc_file)
            shutil.copy2(src, dst)

    # 2. Also place .docx files directly into documents/Phase-X/ folders alongside .md
    for doc_file, phase in phase_mapping.items():
        doc_phase_dir = os.path.join(root, "documents", phase)
        if os.path.exists(doc_phase_dir):
            src = os.path.join(source_dir, doc_file)
            dst = os.path.join(doc_phase_dir, doc_file)
            shutil.copy2(src, dst)
            
        docs_phase_dir = os.path.join(root, "docs", phase)
        if os.path.exists(docs_phase_dir):
            src = os.path.join(source_dir, doc_file)
            dst = os.path.join(docs_phase_dir, doc_file)
            shutil.copy2(src, dst)

print("\nAll docx folders and files populated and synced successfully!")
