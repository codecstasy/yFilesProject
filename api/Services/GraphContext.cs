using api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace api.Services;

public class GraphContext
{
    private readonly IMongoCollection<GraphData> dbContext;
    private const string CollectionName = "GraphData";

    public GraphContext(IOptions<DatabaseSettings> dbSettings)
    {
        var dbClient = new MongoClient(dbSettings.Value.ConnectionString);
        var database = dbClient.GetDatabase(dbSettings.Value.DatabaseName);
        dbContext = database.GetCollection<GraphData>(CollectionName);
    }

    public async Task<GraphData?> GetGraphDataAsync(string graphId)
    {
        if (!ObjectId.TryParse(graphId, out ObjectId objectId))
        {
            return null;
        }
        return await dbContext.Find(g => g.Id == graphId).FirstOrDefaultAsync();
    }

    public async Task DeleteNodesAsync(string graphId, List<string> itemIds)
    {
        if (!ObjectId.TryParse(graphId, out ObjectId objectId))
        {
            throw new Exception("Invalid graph id!");
        }

        var nodeUpdate = Builders<GraphData>.Update.PullFilter(g => g.Nodes, n => itemIds.Contains(n.Id));
        await dbContext.UpdateOneAsync(g => g.Id == graphId, nodeUpdate);

        var edgeUpdate = Builders<GraphData>.Update.PullFilter(g => g.Edges,
            e => itemIds.Contains(e.SourceId) || itemIds.Contains(e.TargetId));
        await dbContext.UpdateOneAsync(g => g.Id == graphId, edgeUpdate);
    }

    public async Task AddNodeAsync(string graphId, AddNodeData nodeData)
    {
        if (!ObjectId.TryParse(graphId, out ObjectId objectId))
        {
            throw new Exception("Invalid graph id!");
        }

        var graph = await dbContext.Find(g => g.Id == graphId).FirstOrDefaultAsync();

        if (graph == null)
        {
            throw new Exception("Graph data was not found in the database.");
        }

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

        var update = Builders<GraphData>.Update
            .Push(g => g.Nodes, newNode)
            .PushEach(g => g.Edges, newEdges);

        await dbContext.UpdateOneAsync(g => g.Id == graphId, update);
    }

    public async Task ResetGraphAsync(string graphId)
    {
        if (string.IsNullOrWhiteSpace(graphId))
        {
            throw new Exception("Graph ID cannot be empty.");
        }

        if (!ObjectId.TryParse(graphId, out ObjectId objectId))
        {
            throw new Exception("Invalid graph id format!");
        }

        var graph = await dbContext.Find(g => g.Id == graphId).FirstOrDefaultAsync();
        var replacingGraph = await dbContext.Find(g => g.Id == "67c4188a8b14961644089123").FirstOrDefaultAsync();

        if (graph == null)
        {
            throw new Exception("Cannot find the graph to be reset");
        }

        if (replacingGraph == null)
        {
            throw new Exception("Cannot find the replacing graph");
        }

        graph.Nodes.Clear();
        graph.Edges.Clear();

        graph.Nodes.AddRange(replacingGraph.Nodes);
        graph.Edges.AddRange(replacingGraph.Edges);

        var filter = Builders<GraphData>.Filter.Eq(g => g.Id, graphId);
        var update = Builders<GraphData>.Update
            .Set(g => g.Nodes, replacingGraph.Nodes)
            .Set(g => g.Edges, replacingGraph.Edges);

        await dbContext.UpdateOneAsync(filter, update);
    }
}

