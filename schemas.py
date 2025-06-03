# In your AgentPreviewConfig model
class AgentPreviewConfig(BaseModel):
    type: str = Field(..., description="Type of preview: 'iframe_url', 'internal_template', 'no_preview'")
    url: Optional[str] = Field(None, description="URL for iframe or external agent UI.")
    # ... other fields ...