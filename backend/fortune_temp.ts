      processingTime: Date.now() - startTime
    };
    
    res.json(response);
  } catch (error: any) {
    console.error('鉂?ModelScope AI鑱婂ぉ澶辫触:', error);
    res.status(500).json({
      success: false,
      error: error.message || '鑱婂ぉ鏈嶅姟鏆傛椂涓嶅彲鐢紝璇风◢鍚庡啀璇?,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
