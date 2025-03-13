import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { GraphData, Ownership } from '../models/graph-data';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  private baseUrl = 'http://localhost:5183/api';
  constructor(private http: HttpClient) { }

  // API call for fetching the graph data
  getGraphData(): Observable<GraphData | null> {
    let data = this.http.get<GraphData[]>(this.baseUrl + '/graph')
    .pipe(
      map(data => data.length > 0 ? data[0] : null)
    );
    return data;
  }

  // API call for deleting the selected item(s)
  deleteSelectedItems(ids: string[]): Observable<any> {
    if (ids.length === 0) {
      return of(null);
    }
  
    const url = `${this.baseUrl}/graph/delete`;
    const body = JSON.stringify(ids);

    return this.http.post(url, body, {
      headers: {'Content-Type' : 'application/json'} 
    });
  }

  // To add a New Node
  addNewNode( nodeName: string, selectedParentNodes: Ownership[] = []): Observable<any> {
    const requestBody = {
      label: nodeName,
      ownershipData: selectedParentNodes.map(fid => ({
        ParentId: fid,
        Percentage: 0.0
      }))
    }
    const url = `${this.baseUrl}/graph/add`;

    return this.http.post(url, requestBody, {
      headers: {'Content-Type' : 'application/json'}
    });
  }
}
