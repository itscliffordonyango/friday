import os
from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from routes.users import users_bp
from routes.ads import ads_bp
from routes.media import media_bp


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///nova.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": os.getenv('CORS_ORIGINS', '*')}})

    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(ads_bp, url_prefix="/api/ads")
    app.register_blueprint(media_bp, url_prefix="/api/media")

    @app.get('/api/health')
    def health_check():
        return jsonify({"status": "ok"})

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
