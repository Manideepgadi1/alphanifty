from app import generate_great_india_graph_data
import json

try:
    print("Testing generate_great_india_graph_data with years=3...")
    graph_data = generate_great_india_graph_data(years=3)
    
    print("\n=== SUCCESS ===")
    print(f"Absolute Returns - Labels: {len(graph_data['absoluteReturns']['labels'])} items")
    print(f"Absolute Returns - Basket Data: {len(graph_data['absoluteReturns']['basketData'])} items")
    print(f"Absolute Returns - Nifty Data: {len(graph_data['absoluteReturns']['niftyData'])} items")
    print(f"\nFirst 3 labels: {graph_data['absoluteReturns']['labels'][:3]}")
    print(f"First 3 basket values: {graph_data['absoluteReturns']['basketData'][:3]}")
    print(f"First 3 nifty values: {graph_data['absoluteReturns']['niftyData'][:3]}")
    
    print(f"\nRolling Returns - Labels: {len(graph_data['rollingReturns']['labels'])} items")
    print(f"Rolling Returns - Basket Data: {len(graph_data['rollingReturns']['basketData'])} items")
    print(f"Rolling Returns - Nifty Data: {len(graph_data['rollingReturns']['niftyData'])} items")
    
    # Test JSON serialization
    json_str = json.dumps(graph_data)
    print(f"\n✓ JSON serialization works, length: {len(json_str)} chars")
    
except Exception as e:
    print(f"\n=== ERROR ===")
    print(f"Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
