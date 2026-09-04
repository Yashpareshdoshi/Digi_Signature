from typing import Optional, List
from fastapi import Header, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User

def get_api_key(x_api_key: Optional[str] = Header(None)) -> Optional[str]:
    """Extracts X-API-Key header from incoming HTTP request."""
    return x_api_key

def get_current_user(
    db: Session = Depends(get_db),
    api_key: Optional[str] = Depends(get_api_key)
) -> Optional[User]:
    """
    Resolves active user based on X-API-Key.
    For prototype flexibility, if no key is provided, returns None
    (endpoints requiring authentication will raise HTTP 401).
    """
    if not api_key:
        return None
    user = db.query(User).filter(User.api_key == api_key, User.is_active == True).first()
    return user

def require_roles(allowed_roles: List[str]):
    """
    FastAPI dependency enforcing role-based access control via X-API-Key.
    Enforces strict 401/403 when REQUIRE_AUTH is active or when an API key is provided.
    """
    def role_checker(
        user: Optional[User] = Depends(get_current_user),
        api_key: Optional[str] = Depends(get_api_key)
    ):
        from app.core.config import settings
        require_auth = getattr(settings, "REQUIRE_AUTH", False)

        if not api_key:
            if require_auth:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing X-API-Key header for authenticated action."
                )
            return None # Development/demo mode allows unauthenticated exploration

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or deactivated API key."
            )
        if user.role not in allowed_roles and user.role != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Requires one of roles {allowed_roles}."
            )
        return user
    return role_checker
