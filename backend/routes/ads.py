from flask import Blueprint, jsonify
from models import Advertisement

ads_bp = Blueprint("ads", __name__)


@ads_bp.route("/", methods=["GET"])
def get_ads():
    ads = Advertisement.query.all()

    return jsonify([
        {
            "id": ad.id,
            "title": ad.title,
            "media_url": ad.media_url
        } for ad in ads
    ])