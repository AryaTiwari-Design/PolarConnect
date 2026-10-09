INSERT INTO users (name, email, password_hash, role, xp) VALUES
('Admin', 'admin@polarconnect.test', '$2b$12$development.hash.replace.in.production', 'admin', 0),
('Researcher', 'researcher@polarconnect.test', '$2b$12$development.hash.replace.in.production', 'researcher', 0),
('Student', 'student@polarconnect.test', '$2b$12$development.hash.replace.in.production', 'student', 0);

INSERT INTO research_papers (title, abstract, topic, station, year, file_path, status, uploaded_by) VALUES
('Antarctic Climate Indicators', 'Demo paper about climate signals and Antarctic monitoring.', 'Climate', 'Maitri', 2024, 'research_docs/approved/Antarctic_factsheet.pdf', 'approved', 2),
('Southern Ocean Biodiversity Notes', 'Demo paper about polar ecosystems and conservation challenges.', 'Biodiversity', 'Bharati', 2023, 'research_docs/approved/p1.pdf', 'pending', 2);
