import { CommonService } from '../../Common/common.service';
import { ClusterRepository } from '../cluster.repository';

export class ClusterSettingModule {
  protected clusterRepository: ClusterRepository;
  protected commonService: CommonService;

  constructor(
    clusterRepository: ClusterRepository,
    commonService: CommonService
  ) {
    this.clusterRepository = clusterRepository;
    this.commonService = commonService;
  }
}
