"""
Canonical Skill Alias & Synonym Normalization Module
---------------------------------------------------
Solves terminology mismatches (e.g. OOPS / OOP / Object Oriented Programming,
DSA / Data Structures & Algorithms, K8s / Kubernetes, React / ReactJS, etc.)
"""

import re
from typing import List, Set, Dict

# Comprehensive Alias Dictionary mapping standard canonical forms to regex patterns & aliases
SKILL_ALIASES: Dict[str, List[str]] = {
    "OOP (Object-Oriented Programming)": [
        r"\boops\b", r"\boop\b", r"object[\s\-]oriented\s+programming", r"object[\s\-]oriented\s+design", r"object[\s\-]oriented\s+principles"
    ],
    "Data Structures & Algorithms (DSA)": [
        r"\bdsa\b", r"data\s+structures\s+(?:and|&)\s+algorithms", r"data\s+structures\b", r"\balgorithms\b"
    ],
    "DBMS (Database Management)": [
        r"\bdbms\b", r"\brdbms\b", r"database\s+management(?:\s+systems?)?", r"database\s+design"
    ],
    "Operating Systems": [
        r"\bos\b(?!\s*x)", r"operating\s+systems?", r"linux\s+kernel", r"process\s+scheduling"
    ],
    "Computer Networks": [
        r"\bcn\b", r"computer\s+networks?", r"tcp/ip", r"network\s+protocols", r"dns/http"
    ],
    "Java": [
        r"\bjava\b(?!\s*script)", r"\bj2ee\b", r"\bcore\s+java\b"
    ],
    "Python": [
        r"\bpython\b", r"\bpython3\b", r"\bpytest\b"
    ],
    "JavaScript": [
        r"\bjavascript\b", r"\bjs\b", r"\bes6\b", r"\becmascript\b"
    ],
    "TypeScript": [
        r"\btypescript\b", r"\bts\b"
    ],
    "React": [
        r"\breact\b(?!\s*ive)", r"\breactjs\b", r"\breact\.js\b", r"\breact\s+native\b"
    ],
    "Node.js": [
        r"\bnode\b", r"\bnodejs\b", r"\bnode\.js\b"
    ],
    "Express.js": [
        r"\bexpress\b", r"\bexpressjs\b", r"\bexpress\.js\b"
    ],
    "Spring Boot": [
        r"spring\s+boot", r"springboot", r"\bspring\s+framework\b", r"\bspring\s+mvc\b"
    ],
    "FastAPI": [
        r"\bfastapi\b", r"\bfast\s+api\b"
    ],
    "REST APIs": [
        r"rest\s*apis?", r"restful(?:\s+apis?|\s+web\s+services?)?", r"\brest\b(?!\s*art)"
    ],
    "GraphQL": [
        r"\bgraphql\b", r"\bgql\b"
    ],
    "Microservices": [
        r"microservices?", r"microservice\s+architecture", r"distributed\s+systems?"
    ],
    "MongoDB": [
        r"\bmongodb\b", r"\bmongo\b", r"\bmongoose\b"
    ],
    "PostgreSQL": [
        r"\bpostgresql\b", r"\bpostgres\b", r"\bpsql\b"
    ],
    "SQL / RDBMS": [
        r"\bsql\b", r"\bmysql\b", r"\bsqlite\b", r"\boracle\s+sql\b", r"relational\s+databases?"
    ],
    "Redis": [
        r"\bredis\b", r"redis\s+cache", r"in-memory\s+caching"
    ],
    "Docker": [
        r"\bdocker\b", r"containerization", r"dockerfile", r"docker-compose"
    ],
    "Kubernetes": [
        r"\bkubernetes\b", r"\bk8s\b", r"helm\s+charts?", r"k8s\s+cluster"
    ],
    "AWS": [
        r"\baws\b", r"amazon\s+web\s+services?", r"aws\s+cloud", r"\bec2\b", r"\bs3\b", r"\blambda\b"
    ],
    "GCP": [
        r"\bgcp\b", r"google\s+cloud(?:\s+platform)?", r"google\s+cloud\s+run"
    ],
    "Azure": [
        r"\bazure\b", r"microsoft\s+azure"
    ],
    "CI/CD": [
        r"ci/cd", r"cicd", r"continuous\s+integration", r"continuous\s+deployment", r"github\s+actions", r"jenkins\b"
    ],
    "Git / Version Control": [
        r"\bgit\b", r"\bgithub\b", r"\bgitlab\b", r"version\s+control"
    ],
    "Machine Learning": [
        r"machine\s+learning", r"\bml\b", r"\bscikit-learn\b", r"\bpandas\b", r"\bnumpy\b"
    ],
    "Deep Learning": [
        r"deep\s+learning", r"\bdl\b", r"\btensorflow\b", r"\bpytorch\b", r"\bkeras\b"
    ],
    "NLP": [
        r"\bnlp\b", r"natural\s+language\s+processing", r"\bspacy\b", r"\bhuggingface\b", r"\btransformers\b"
    ],
    "Generative AI & LLMs": [
        r"generative\s+ai", r"\bgenai\b", r"\bllms?\b", r"large\s+language\s+models?", r"\brag\b", r"prompt\s+engineering", r"\bfaiss\b", r"\blangchain\b"
    ],
    "Agile / Scrum": [
        r"\bagile\b", r"\bscrum\b", r"\bkanban\b", r"\bsprint\b"
    ]
}


class SkillNormalizer:
    @staticmethod
    def extract_canonical_skills(text: str) -> List[str]:
        """
        Scans raw text and matches synonyms/abbreviations (e.g. OOPS -> OOP, DSA -> Data Structures & Algorithms).
        Returns deduplicated list of canonical skill names.
        """
        extracted = []
        lower_text = text.lower()

        for canonical_name, patterns in SKILL_ALIASES.items():
            for pat in patterns:
                if re.search(pat, lower_text, re.IGNORECASE):
                    extracted.append(canonical_name)
                    break

        return extracted

    @staticmethod
    def normalize_single_skill(skill_name: str) -> str:
        """
        Maps a single skill term (e.g. 'OOPS', 'DSA', 'K8s', 'ReactJS') to its canonical enterprise form.
        """
        trimmed = skill_name.strip()
        lower = trimmed.lower()

        for canonical_name, patterns in SKILL_ALIASES.items():
            for pat in patterns:
                if re.search(pat, lower, re.IGNORECASE):
                    return canonical_name

        return trimmed.title()
