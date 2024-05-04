import { TestBed } from '@angular/core/testing';

import { SensorwebsocketService } from './sensorwebsocket.service';

describe('SensorwebsocketService', () => {
  let service: SensorwebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorwebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
