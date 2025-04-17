using api.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace api.Services;
public class GraphDataService
{
    private readonly GraphContext _graphContext;

    public GraphDataService(GraphContext graphContext)
    {
        _graphContext = graphContext;
    }

    public async Task SetLayoutAlgorithmAsync(string layoutString, string graphId)
    {
        await _graphContext.SetLayoutAlgorithmAsync(layoutString, graphId);
    }

    public async Task <GraphData> CreateNewGraphAsync(string graphName)
    {
        var graph = new GraphData
        {
            GraphName = graphName,
            IsBackup = false,
            Nodes = new List<Node>(),
            Edges = new List<Edge>()
        };

        await _graphContext.CreateNewGraphAsync(graph);
        return graph;
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

    public async Task<Node> AddNodeAsync(string graphId, AddNodeData nodeData)
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
        return newNode;
    }

    public async Task ResetGraphAsync(string graphId)
    {
        await _graphContext.ResetGraphAsync(graphId);
    }
}