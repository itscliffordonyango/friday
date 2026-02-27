from flask import Blueprint, jsonify, request
from models import db, Media

media_bp = Blueprint("media", __name__, url_prefix="/api/media")


@media_bp.route("/", methods=["GET"])
def get_all_media():
    media = Media.query.all()
    return jsonify([m.to_dict() for m in media])


@media_bp.route("/", methods=["POST"])
def create_media():
    data = request.json

    media = Media(
        title=data["title"],
        description=data.get("description"),
        genre=data.get("genre"),
        year=data.get("year"),
        thumbnail=data.get("thumbnail"),
        video_url=data.get("video_url"),
        is_featured=data.get("isFeatured", False)
    )

    db.session.add(media)
    db.session.commit()

    return jsonify(media.to_dict()), 201