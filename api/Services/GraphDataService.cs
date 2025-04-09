using api.Models;
using MongoDB.Bson;

namespace api.Services;
public class GraphDataService
{
    private readonly GraphContext _graphContext;

    public GraphDataService(GraphContext graphContext)
    {
        _graphContext = graphContext;
    }

    public async Task<List<GraphData>> GetAllGraphsAsync()
    {
        return await _graphContext.GetAllGraphsAsync();
    }

    public async Task<GraphData?> GetDataAsync(string graphId)
    {
        return await _graphContext.GetDataAsync(graphId);
    }

    public async Task DeleteNodesAsync(string graphId, List<string> itemIds)
    {
        await _graphContext.DeleteNodesAsync(graphId, itemIds);
    }

    public async Task AddNodeAsync(string graphId, AddNodeData nodeData)
    {
        string newNodeId = Guid.NewGuid().ToString();

        var newNode = new Node
        {
            Id = newNodeId,
            Label = nodeData.Label,
            Ownerships = nodeData.OwnershipData
        };

        var newEdges = nodeData.OwnershipData
            .Select(ownership => new Edge
            {
                Id = Guid.NewGuid().ToString(),
                SourceId = ownership.ParentId,
                TargetId = newNodeId
            })
            .ToList();

        await _graphContext.AddNodeAsync(graphId, newNode, newEdges);
    }

    public async Task ResetGraphAsync(string graphId)
    {
        await _graphContext.ResetGraphAsync(graphId);
    }
}