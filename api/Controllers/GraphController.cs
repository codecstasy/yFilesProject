using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GraphController(GraphDataService _graphDataService) : Controller
{
    // Get Data
    [HttpGet]
    public async Task<List<GraphData>> GetDataAsync()
    {
        var data = await _graphDataService.GetDataAsync();
        return data;
    }

    // Delete Selected Nodes
    [HttpPost("delete")]
    public async Task<IActionResult> DeleteNodesAsync([FromBody] List<string> itemIds)
    {
        if (itemIds == null || itemIds.Count == 0)
        {
            return BadRequest("No item IDs provided.");
        }

        //Console.WriteLine($"Deleting nodes: {string.Join(",", itemIds)}");

        await _graphDataService.DeleteNodesAsync(itemIds);

        return Ok("Nodes deleted successfully.");
    }

    //Add new node
    [HttpPost("add")]
    public async Task<IActionResult> AddNodeAsync([FromBody] AddNodeData nodeData)
    {
        try
        {
            if (nodeData == null || string.IsNullOrWhiteSpace(nodeData.Label))
            {
                return BadRequest(new { message = "Invalid Node Data" });
            }

            await _graphDataService.AddNodeAsync(nodeData);

            return Ok(new { message = "Node added successfully", nodeName = nodeData.Label });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while adding node", error = ex.Message });
        }
    }

}
