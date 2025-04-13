using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GraphController(GraphDataService _graphDataService) : Controller
{
    // Create Graph
    [HttpGet("createnewgraph")]
    public async Task<IActionResult> CreateNewGraphAsync([FromQuery] string graphName)
    {
        if (string.IsNullOrEmpty(graphName))
        {
            return BadRequest(new { message = "Provide graph name!" });
        }
        var graph = await _graphDataService.CreateNewGraphAsync(graphName);
        return Ok(graph);
    }

    // Get all graphs
    [HttpGet("getallgraphs")]
    public async Task<ActionResult<List<GraphData>>> GetAllGraphsAsync()
    {
        var graphs = await _graphDataService.GetAllGraphsAsync();
        if (graphs == null)
        {
            return NotFound(new { message = "No graph found" });
        }
        return Ok(graphs);
    }
    
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

            var newNode = await _graphDataService.AddNodeAsync(graphId, nodeData);

            return Ok(newNode);
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
