﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models;
public class Node
{
    public required string Id { get; set; }
    public required string Label { get; set; }
    public List<Ownership> Ownerships { get; set; }
}
public class Edge
{
    public required string Id { get; set; }
    public required string SourceId { get; set; }
    public required string TargetId { get; set; }
}
public class Ownership
{
    public string ParentId { get; set; }
    public double Percentage { get; set; }
}
public class AddNodeData
{
    public string Label { get; set; }
    public List<Ownership> OwnershipData { get; set; }

    public AddNodeData()
    {
        Label = "";
        OwnershipData = new List<Ownership>();
    }
}
public class GraphData
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public bool IsBackup { get; set; } = false;
    public string GraphName { get; set; } = string.Empty;
    public LayoutType Layout { get; set; } = LayoutType.HierarchicLayout;
    public required List<Node> Nodes { get; set; }
    public required List<Edge> Edges { get; set; }
}

public enum LayoutType {
    HierarchicLayout = 0,
    OrganicLayout = 1,
    OrthogonalLayout = 2,
    CircularLayout = 3,
    RadialLayout = 4
}
