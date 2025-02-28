const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    
    res.status(500).json({ error: 'Something went wrong!' });
  };
  
  module.exports = errorHandler;