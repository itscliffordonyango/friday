from flask import Blueprint, request, jsonify
from models import db, User

users_bp = Blueprint("users", __name__)


@users_bp.route("/", methods=["POST"])
def create_user():
    data = request.json

    user = User(email=data["email"])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"})