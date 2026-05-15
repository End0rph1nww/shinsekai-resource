"""add: resources table

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-05-15 05:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, None] = 'b2c3d4e5f6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'resources',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('type', sa.String(length=32), nullable=False),
        sa.Column('resource_id', sa.String(length=255), nullable=False),
        sa.Column('display_name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('tags', sa.Text(), nullable=False),
        sa.Column('preview_url', sa.String(length=500), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_resources_type'), 'resources', ['type'], unique=False)
    op.create_index(op.f('ix_resources_resource_id'), 'resources', ['resource_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_resources_resource_id'), table_name='resources')
    op.drop_index(op.f('ix_resources_type'), table_name='resources')
    op.drop_table('resources')
