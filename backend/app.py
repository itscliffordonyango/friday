from flask import Flask
from flask_cors import CORS
from models import db
from routes.users import users_bp
from routes.ads import ads_bp
from routes.media import media_bp   


def create_app():
    app = Flask(__name__)

    # Database config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nova.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    CORS(app)  # allow React to talk to Flask

    # Register routes
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(ads_bp, url_prefix="/api/ads")
    app.register_blueprint(media_bp, url_prefix="/api/media")  # ✅ ADD IT HERE

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)