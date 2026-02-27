from flask import Blueprint, request, jsonify
from models import db, User

users_bp = Blueprint("users", __name__)


@users_bp.route("/", methods=["POST"])
def create_user():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "email is required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"message": "User already exists", "id": existing.id}), 200

    user = User(email=email)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created", "id": user.id}), 201
