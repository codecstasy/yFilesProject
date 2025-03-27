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
    public async Task<ActionResult<GraphData>> GetDataAsync([FromQuery] string graphId)
    {
        if(string.IsNullOrEmpty(graphId))
        {
            return BadRequest(new { message = "Provide graph id!" });
        }
        var graph = await _graphDataService.GetDataAsync(graphId);
        if(graph == null)
        {
            return NotFound(new { message = "Graph not found"});
        }

        return Ok(graph);
    }

    // Delete Selected Nodes
    [HttpPost("delete")]
    public async Task<IActionResult> DeleteNodesAsync([FromQuery] string graphId, [FromBody] List<string> itemIds)
    {
        if (string.IsNullOrEmpty(graphId))
        {
            return BadRequest(new { message = "Provide graph id!" });
        }

        if (itemIds == null || itemIds.Count == 0)
        {
            return BadRequest("No item IDs provided.");
        }

        //Console.WriteLine($"Deleting nodes: {string.Join(",", itemIds)}");

        await _graphDataService.DeleteNodesAsync(graphId, itemIds);

        return Ok("Nodes deleted successfully.");
    }

    // Add new node
    [HttpPost("add")]
    public async Task<IActionResult> AddNodeAsync([FromQuery] string graphId, [FromBody] AddNodeData nodeData)
    {
        try
        {
            if (string.IsNullOrEmpty(graphId))
            {
                return BadRequest(new { message = "Provide graph id!" });
            }

            if (nodeData == null || string.IsNullOrWhiteSpace(nodeData.Label))
            {
                return BadRequest(new { message = "Invalid Node Data" });
            }

            await _graphDataService.AddNodeAsync(graphId, nodeData);

            return Ok(new { message = "Node added successfully", nodeName = nodeData.Label });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while adding node", error = ex.Message });
        }
    }

    // Reset graph
    [HttpGet("reset")]
    public async Task<IActionResult> ResetGraphAsync([FromQuery] string graphId)
    {
        try
        {
            if (string.IsNullOrEmpty(graphId))
            {
                return BadRequest(new { message = "Provide graph id!" });
            }

            await _graphDataService.ResetGraphAsync(graphId);

            return Ok(new { message = "Graph has been reset successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while resetting the graph", error = ex.Message });
        }
    }

}
