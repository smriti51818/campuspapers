from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_authenticity(new_text: str, existing_texts: List[str]) -> Dict:
    corpus = existing_texts + [new_text]
    if len(corpus) == 1:
        return {"isAuthentic": True, "authenticityScore": 95, "aiFeedback": "No references provided; treating as authentic by default."}
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    X = vectorizer.fit_transform(corpus)
    sims = cosine_similarity(X[-1], X[:-1]).flatten()
    max_sim = float(sims.max()) if sims.size else 0.0
    score = int(max(0.0, (1.0 - max_sim)) * 100)
    is_authentic = max_sim < 0.7
    feedback = "Low similarity to existing items." if is_authentic else "Duplication detected"
    return {"isAuthentic": bool(is_authentic), "authenticityScore": int(score), "aiFeedback": feedback}
