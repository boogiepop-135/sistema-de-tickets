from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(
        String(80), unique=True, nullable=False)  # Nuevo campo username
    email: Mapped[str] = mapped_column(
        String(120), nullable=False)  # Email ya no es único
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="user")  # 'user' o 'admin'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            # do not serialize the password, its a security breach
        }


class Ticket(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="open")  # open, pending, in_progress, closed
    priority: Mapped[str] = mapped_column(
        String(20), nullable=False, default="medium")  # low, medium, high, urgent
    category: Mapped[str] = mapped_column(
        String(50), nullable=False, default="general")  # general, technical, billing, other
    created_at: Mapped[str] = mapped_column(
        String(30), nullable=False, default="2025-01-01 00:00:00")
    updated_at: Mapped[str] = mapped_column(
        String(30), nullable=False, default="2025-01-01 00:00:00")
    user_id: Mapped[int] = mapped_column(
        db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "category": self.category,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "user_id": self.user_id
        }
