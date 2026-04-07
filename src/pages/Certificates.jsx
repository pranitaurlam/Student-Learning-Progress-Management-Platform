import { useState, useEffect } from 'react';
import { FaAward, FaCertificate, FaUpload, FaDownload, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { IoSchool } from 'react-icons/io5';
import './Certificates.css';

export default function Certificates() {
    const [earnedCertificates, setEarnedCertificates] = useState([]);
    const [uploadedCertificates, setUploadedCertificates] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('mindforge_uploaded_certs') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        // Load test history and find high scores (>90%)
        const history = JSON.parse(localStorage.getItem('mindforge_test_history') || '[]');
        const subjects = {
            'ai-ml': 'AI/ML Excellence',
            'dsa': 'DSA Algorithm Master',
            'web-dev': 'Web Development Pro',
            'dbms': 'DBMS Database Specialist',
            'python': 'Python Programming Expert'
        };

        const earned = history
            .filter(test => test.accuracy >= 90)
            .map((test, index) => ({
                id: `earned-${index}`,
                title: subjects[test.subject] || `${test.subject} Achievement`,
                issueDate: new Date(test.date).toLocaleDateString(),
                score: test.accuracy,
                type: 'earned'
            }));

        // Filter out duplicate subject certificates, keep highest score
        const uniqueEarned = Object.values(earned.reduce((acc, curr) => {
            if (!acc[curr.title] || acc[curr.title].score < curr.score) {
                acc[curr.title] = curr;
            }
            return acc;
        }, {}));

        setEarnedCertificates(uniqueEarned);
    }, []);

    useEffect(() => {
        localStorage.setItem('mindforge_uploaded_certs', JSON.stringify(uploadedCertificates));
    }, [uploadedCertificates]);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const newCert = {
            id: `uploaded-${Date.now()}`,
            title: file.name.split('.')[0] || 'My Certificate',
            fileName: file.name,
            uploadDate: new Date().toLocaleDateString(),
            type: 'uploaded'
        };

        setUploadedCertificates([newCert, ...uploadedCertificates]);
    };

    const deleteUploaded = (id) => {
        setUploadedCertificates(uploadedCertificates.filter(c => c.id !== id));
    };

    return (
        <div className="certificates-page">
            <div className="container">
                <header className="page-header">
                    <div className="header-content">
                        <h1>My Achievements</h1>
                        <p>Celebrate your progress and keep your professional certifications all in one place.</p>
                    </div>
                </header>

                {/* Statistics Summary */}
                <div className="cert-stats-row">
                    <div className="cert-stat-card">
                        <FaAward className="stat-icon gold" />
                        <div className="stat-info">
                            <span className="stat-value">{earnedCertificates.length}</span>
                            <span className="stat-label">Earned Online</span>
                        </div>
                    </div>
                    <div className="cert-stat-card">
                        <FaUpload className="stat-icon blue" />
                        <div className="stat-info">
                            <span className="stat-value">{uploadedCertificates.length}</span>
                            <span className="stat-label">Uploaded Plans</span>
                        </div>
                    </div>
                </div>

                <div className="certificates-layout">
                    {/* Earned Certificates Section */}
                    <section className="cert-section">
                        <div className="section-header">
                            <FaCertificate className="section-icon gold" />
                            <h2>Academic Certificates</h2>
                        </div>

                        {earnedCertificates.length > 0 ? (
                            <div className="cert-grid">
                                {earnedCertificates.map(cert => (
                                    <div key={cert.id} className="cert-card earned">
                                        <div className="cert-seal">
                                            <IoSchool />
                                        </div>
                                        <div className="cert-body">
                                            <h3>{cert.title}</h3>
                                            <p className="issued-by">Verified by MindForge Academy</p>
                                            <div className="cert-footer">
                                                <span className="date">Issued: {cert.issueDate}</span>
                                                <span className="score">Score: {cert.score}%</span>
                                            </div>
                                        </div>
                                        <div className="cert-actions">
                                            <button className="download-btn" title="Download Certificate">
                                                <FaDownload />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Complete a mock test with 90% or higher accuracy to earn your first certificate!</p>
                            </div>
                        )}
                    </section>

                    {/* Upload Section */}
                    <section className="cert-section">
                        <div className="section-header">
                            <FaUpload className="section-icon blue" />
                            <h2>External Certifications</h2>
                        </div>

                        <div className="upload-zone">
                            <input
                                type="file"
                                id="cert-upload"
                                className="hidden-input"
                                onChange={handleUpload}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <label htmlFor="cert-upload" className="upload-label">
                                <div className="upload-icon-circle">
                                    <FaUpload />
                                </div>
                                <span>Click to upload or drag & drop</span>
                                <small>Supported formats: PDF, JPG, PNG</small>
                            </label>
                        </div>

                        <div className="uploaded-list">
                            {uploadedCertificates.map(cert => (
                                <div key={cert.id} className="uploaded-cert-item">
                                    <div className="cert-icon-mini">
                                        <FaCertificate />
                                    </div>
                                    <div className="cert-item-info">
                                        <h4>{cert.title}</h4>
                                        <p>Uploaded on {cert.uploadDate}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button className="view-btn">View</button>
                                        <button className="delete-btn" onClick={() => deleteUploaded(cert.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
