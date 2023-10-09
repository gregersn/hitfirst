from datetime import timedelta
import os
from wtforms.csrf.session import SessionCSRF
from wtforms import Form
from starlette_wtf import StarletteForm


class BaseForm(StarletteForm):
    class Meta:
        csrf = True
        csrf_class = SessionCSRF
        csrf_secret = os.urandom(16)
        csrf_time_limit = timedelta(minutes=20)


class CreateTrackerForm(BaseForm):
    ...
