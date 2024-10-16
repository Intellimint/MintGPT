import logging
from uuid import uuid4

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MockIPFSClient:
    def __init__(self):
        self.storage = {}

    def add_str(self, content):
        hash = str(uuid4())
        self.storage[hash] = content
        return hash

    def cat(self, hash):
        return self.storage.get(hash, "").encode('utf-8')

mock_client = MockIPFSClient()

def connect_to_ipfs():
    logger.info("Connected to mock IPFS client")
    return mock_client

def add_to_ipfs(content):
    try:
        res = mock_client.add_str(content)
        logger.info(f"Successfully added content to mock IPFS with hash: {res}")
        return res
    except Exception as e:
        logger.error(f"Error adding content to mock IPFS: {str(e)}")
    return None

def get_from_ipfs(hash):
    try:
        content = mock_client.cat(hash)
        logger.info(f"Successfully retrieved content from mock IPFS for hash: {hash}")
        return content.decode('utf-8')
    except Exception as e:
        logger.error(f"Error retrieving content from mock IPFS: {str(e)}")
    return None