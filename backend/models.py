from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Advertisement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    media_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
class Media(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    genre = db.Column(db.String(50))
    year = db.Column(db.String(10))
    thumbnail = db.Column(db.String(500))
    video_url = db.Column(db.String(500))
    is_featured = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "genre": self.genre,
            "year": self.year,
            "thumbnail": self.thumbnail,
            "video_url": self.video_url,
            "isFeatured": self.is_featured
        }