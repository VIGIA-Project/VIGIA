from insightface.app import FaceAnalysis

class FaceModelSingleton:
    _instance = None
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            # Initialize InsightFace buffalo_l model using CPU
            cls._instance = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
            # Prepare context with det_size=(640, 640) as suggested
            cls._instance.prepare(ctx_id=0, det_size=(640, 640))
        return cls._instance
