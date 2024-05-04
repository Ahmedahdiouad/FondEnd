import { TestBed } from '@angular/core/testing';

import { MachinewebsocketService } from './machinewebsocket.service';

describe('MachinewebsocketService', () => {
  let service: MachinewebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachinewebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
