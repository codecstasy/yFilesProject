import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { GraphData, Ownership } from '../models/graph-data';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  private baseUrl = 'http://localhost:5183/api';
  constructor(private http: HttpClient) { }

  // API call for fetching the graph data
  getGraphData(graphId: string): Observable<GraphData | null> {
    let data = this.http.get<GraphData>(`${this.baseUrl}/graph?graphId=${graphId}`)
    .pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
    return data;
  }

  // API call for deleting the selected item(s)
  deleteSelectedItems(graphId: string, ids: string[]): Observable<any> {
    if (ids.length === 0) {
      return of(null);
    }
  
    const url = `${this.baseUrl}/graph/delete?graphId=${graphId}`;
    const body = JSON.stringify(ids);

    return this.http.post(url, body, {
      headers: {'Content-Type' : 'application/json'} 
    });
  }

  // To add a New Node
  addNewNode(graphId: string, nodeName: string, selectedParentNodes: Ownership[] = []): Observable<any> {
    const requestBody = {
      label: nodeName,
      ownershipData: selectedParentNodes.map(fid => ({
        ParentId: fid,
        Percentage: 0.0
      }))
    }

    const url = `${this.baseUrl}/graph/add?graphId=${graphId}`;

    return this.http.post(url, requestBody, {
      headers: {'Content-Type' : 'application/json'}
    });
  }

  resetGraph(graphId: string): Observable<any> {
    const url = `${this.baseUrl}/graph/reset?graphId=${graphId}`;

    let data = this.http.get(url)
    .pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );

    return data;
  }
}
