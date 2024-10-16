import logging
from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

# Set up logging
logger = logging.getLogger(__name__)

# --- User CRUD Operations ---
def get_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        logger.info(f"Retrieved user {user.id}")
    else:
        logger.warning(f"User {user_id} not found.")
    return user

def get_user_by_email(db: Session, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        logger.info(f"Retrieved user with email {email}")
    else:
        logger.warning(f"User with email {email} not found.")
    return user

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"Created new user {db_user.id}")
    return db_user

# --- Session CRUD Operations ---
def get_session(db: Session, session_id: int):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if session:
        logger.info(f"Retrieved session {session.id}")
    else:
        logger.warning(f"Session {session_id} not found.")
    return session

def create_session(db: Session, session: schemas.SessionCreate):
    db_session = models.Session(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    logger.info(f"Created new session {db_session.id}")
    return db_session

def update_session(db: Session, session_id: int):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if session:
        session.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(session)
        logger.info(f"Updated session {session.id}")
    else:
        logger.warning(f"Session {session_id} not found.")
    return session

# --- Conversation CRUD Operations ---
def get_conversation(db: Session, conversation_id: int):
    conversation = db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()
    if conversation:
        logger.info(f"Retrieved conversation {conversation.id} for session {conversation.session_id}")
    else:
        logger.warning(f"Conversation {conversation_id} not found.")
    return conversation

def create_conversation(db: Session, conversation: schemas.ConversationCreate):
    db_conversation = models.Conversation(**conversation.dict())
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    logger.info(f"Created new conversation {db_conversation.id} for session {db_conversation.session_id}")
    return db_conversation

# --- Message CRUD Operations ---
def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    logger.info(f"Created new message {db_message.id} in conversation {db_message.conversation_id}")
    return db_message

def get_conversation_messages(db: Session, conversation_id: int, limit: int = 100):
    messages = db.query(models.Message).filter(models.Message.conversation_id == conversation_id).order_by(models.Message.created_at.asc()).limit(limit).all()
    logger.info(f"Retrieved {len(messages)} messages for conversation {conversation_id}")
    return messages
