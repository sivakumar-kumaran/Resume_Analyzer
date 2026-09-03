"""
Matching & Analysis Service
---------------------------
Calculates match percentage deterministically in Python using measurable components:
- Technical Skills (40%)
- Experience (20%)
- Projects (20%)
- Education (10%)
- Soft Skills & Certifications (10%)

Implements both Keyword Matching (exact term comparison) and Semantic Matching (vector similarity).
"""

from typing import List, Dict, Any, Tuple
from app.services.llm_service import LLMService
from app.services.embedding_service import EmbeddingService
from app.services.skill_normalizer import SkillNormalizer
from app.models.schemas.match import SkillMatchResponse, MatchScoreBreakdown


class MatchingService:
    @staticmethod
    def analyze_match(resume_text: str, job_text: str) -> SkillMatchResponse:
        # 1. Parse Resume & Job Description into structured format
        parsed_resume = LLMService.parse_resume_to_json(resume_text)
        parsed_job = LLMService.parse_job_description_to_json(job_text)

        candidate_name = parsed_resume.get("name", "Candidate")
        job_title = parsed_job.get("title", "Software Engineer")

        # Extract Canonical Normalized Skills from both raw texts and parsed lists
        resume_canonical = set(SkillNormalizer.extract_canonical_skills(resume_text))
        for s in parsed_resume.get("technical_skills", []):
            resume_canonical.add(SkillNormalizer.normalize_single_skill(s))

        job_canonical = set(SkillNormalizer.extract_canonical_skills(job_text))
        for s in parsed_job.get("required_skills", []) + parsed_job.get("preferred_skills", []):
            job_canonical.add(SkillNormalizer.normalize_single_skill(s))

        if not job_canonical:
            job_canonical = {"Java", "React", "REST APIs", "SQL / RDBMS", "Python", "Git / Version Control"}

        # 2. Match Calculation with Canonical Equivalence
        keyword_matched = []
        missing_skills = []

        for j_skill in sorted(job_canonical):
            if j_skill in resume_canonical:
                keyword_matched.append(j_skill)
            else:
                missing_skills.append(j_skill)

        # 3. Semantic Embedding Matching (Approach B)
        semantic_matched = []
        still_missing = []

        for skill in missing_skills:
            skill_vec = EmbeddingService.get_embedding(skill)
            # Compare against full resume text embedding
            resume_vec = EmbeddingService.get_embedding(resume_text)
            similarity = EmbeddingService.cosine_similarity(skill_vec, resume_vec)

            # High semantic correlation threshold (e.g. >= 0.45)
            if similarity >= 0.45:
                semantic_matched.append(skill)
            else:
                still_missing.append(skill)

        total_matched_count = len(keyword_matched) + len(semantic_matched)
        tech_score = (total_matched_count / len(job_canonical)) * 100.0 if job_canonical else 80.0
        tech_score = min(100.0, tech_score)

        # 4. Measure Component Scores
        # Experience score (20%)
        exp_list = parsed_resume.get("experience", [])
        exp_score = 100.0 if len(exp_list) >= 2 else (75.0 if len(exp_list) == 1 else 50.0)

        # Projects score (20%)
        proj_list = parsed_resume.get("projects", [])
        proj_score = 100.0 if len(proj_list) >= 2 else (70.0 if len(proj_list) == 1 else 40.0)

        # Education score (10%)
        edu_list = parsed_resume.get("education", [])
        edu_score = 100.0 if edu_list else 60.0

        # Other Requirements score (10%)
        certs = parsed_resume.get("certifications", [])
        soft = parsed_resume.get("soft_skills", [])
        other_score = 100.0 if (certs and soft) else (75.0 if (certs or soft) else 50.0)

        # 5. Deterministic Weighted Match Calculation
        # Technical 40%, Experience 20%, Projects 20%, Education 10%, Other 10%
        overall_score = (
            (tech_score * 0.40) +
            (exp_score * 0.20) +
            (proj_score * 0.20) +
            (edu_score * 0.10) +
            (other_score * 0.10)
        )

        breakdown = MatchScoreBreakdown(
            technical_skills=round(tech_score, 1),
            experience=round(exp_score, 1),
            projects=round(proj_score, 1),
            education=round(edu_score, 1),
            other_requirements=round(other_score, 1),
            overall_score=round(overall_score, 1),
        )

        # 6. Generate Strengths & ATS Recommendations
        strengths = [
            f"Strong technical alignment in key stack: {', '.join(keyword_matched[:4]) if keyword_matched else 'Core Skills'}.",
            f"Solid project background with {len(proj_list)} practical projects demonstrating backend/frontend capabilities.",
            f"Relevant formal education background in Computer Science / Engineering.",
        ]

        weaknesses = [
            f"Missing required job skills: {', '.join(still_missing[:3]) if still_missing else 'None identified'}."
        ]

        ats_suggestions = [
            f"Add explicit keywords for missing requirements: {', '.join(still_missing[:4]) if still_missing else 'Include metrics'}.",
            "Use clear section headers (TECHNICAL SKILLS, EXPERIENCE, PROJECTS, EDUCATION) to optimize ATS parsing.",
            "Quantify achievements with metrics (e.g. 'Improved API response time by 25%').",
        ]

        return SkillMatchResponse(
            candidate_name=candidate_name,
            job_title=job_title,
            overall_match_score=round(overall_score, 1),
            score_breakdown=breakdown,
            keyword_matched_skills=keyword_matched,
            semantic_matched_skills=semantic_matched,
            missing_skills=still_missing,
            strengths=strengths,
            weaknesses=weaknesses,
            ats_suggestions=ats_suggestions,
            recommended_improvements=[
                f"Build a mini-project incorporating missing skills: {', '.join(still_missing[:2]) if still_missing else 'System Design'}.",
                "Highlight system architecture decisions and failure-handling strategies in project bullets.",
            ],
        )
