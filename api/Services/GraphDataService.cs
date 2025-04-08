using api.Models;

namespace api.Services;
public class GraphDataService
{
    private readonly GraphContext _graphContext;

    public GraphDataService(GraphContext graphContext)
    {
        _graphContext = graphContext;
    }

    public async Task<GraphData?> GetDataAsync(string graphId)
    {
        return await _graphContext.GetGraphDataAsync(graphId);
    }

    public async Task DeleteNodesAsync(string graphId, List<string> itemIds)
    {
        await _graphContext.DeleteNodesAsync(graphId, itemIds);
    }

    public async Task AddNodeAsync(string graphId, AddNodeData nodeData)
    {
        await _graphContext.AddNodeAsync(graphId, nodeData);
    }

    public async Task ResetGraphAsync(string graphId)
    {
        await _graphContext.ResetGraphAsync(graphId);
    }
}