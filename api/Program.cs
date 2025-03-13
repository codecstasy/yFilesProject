using api.Models;
using api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("yFilesLearningDatabase"));
builder.Services.AddSingleton<GraphDataService>();

// Define CORS policy name
var corsPolicyName = "AllowAngularApp";

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Angular dev server
              .AllowAnyMethod()  // Allow all HTTP methods (GET, POST, PUT, DELETE)
              .AllowAnyHeader()  // Allow all headers
              .AllowCredentials(); // Allow cookies/auth headers if needed
    });
});

var app = builder.Build();

// Use Cors
app.UseCors(corsPolicyName);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
