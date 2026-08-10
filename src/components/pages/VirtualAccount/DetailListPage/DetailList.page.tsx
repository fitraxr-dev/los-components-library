'use client';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import AddEditVA from '../components/AddEditVA';
import ModalDecline from '../components/ModalDecline';
import { modal } from '../ListPage/List.constants';

import useDetailVa from './useDetailVa.hook';


const DetailListPage = () => {
  const canAddVa = useCheckAccess(accessid.VIRTUAL_ACCOUNT_CREATE);

  const {
    // Filter content lists for each table
    filterContentListRequest,
    filterContentListCurrent,
    filterContentListPrevious,
    filterDropdownList,
    handleActive,
    handleCancel,
    handleDecline,
    handleNonActive,
    handleSubmit,
    handleNext,
    // handleOnSave,
    // Request Table
    filterRequest,
    isLoadingRequest,
    itemPerPageRequest,
    noPageRequest,
    setNoPageRequest,
    setItemPerPageRequest,
    setFilterRequest,
    tableDataRequest,
    tableHeaderRequest,
    tablePageRequest,
    // Current Table
    filterCurrent,
    isLoadingCurrent,
    itemPerPageCurrent,
    noPageCurrent,
    setNoPageCurrent,
    setItemPerPageCurrent,
    setFilterCurrent,
    tableDataCurrent,
    tableHeaderCurrent,
    tablePageCurrent,
    // Previous Table
    filterPrevious,
    isLoadingPrevious,
    itemPerPagePrevious,
    noPagePrevious,
    setNoPagePrevious,
    setItemPerPagePrevious,
    setFilterPrevious,
    tableDataPrevious,
    tableHeaderPrevious,
    tablePagePrevious,
    isAnyItemSelected,
    isSuperAdmin,
    isStaffDkhi,
    isStaff,
    isTL,
    isKadiv,
    isDetail,
    handleCommenctVa,
    isActivation,
    isApproval,
    isApprovalChecker,
    isCreation,
    isReturnStaff,
    isReturnMaker,
    bucketProcessId,
    isMaker,
    isChecker,
    isPathActivation,
    handleOnCancelProcess,
    viewOnly,
  } = useDetailVa();

  const renderButtons = () => {
    // Jika peran adalah isTL
    if (!isDetail && (isTL || isChecker)) {
      if ((isApproval || isApprovalChecker) && !isActivation) {
        return (
          <>
            {/* {!viewOnly && ( */}
            <Button variant="outlined" color="error" onClick={() => handleDecline()}>
              Decline
            </Button>
            {/* )} */}

            {isChecker ? (
              isApprovalChecker ? (
                <>
                  {!viewOnly && (
                    <>
                      <Button variant="outlined" onClick={() => handleCommenctVa()}>
                        Comment
                      </Button>
                      <Button variant="outlined" onClick={() => handleSubmit('RETURN_TO_MAKER')}>
                        Return To Maker
                      </Button>
                      <Button
                        disabled={bucketProcessId === 'VA-ID'}
                        onClick={() => handleSubmit('SUBMIT')}
                        color="success"
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {!viewOnly && (
                    <>
                      <Button variant="outlined" onClick={() => handleSubmit('RETURN_TO_STAFF')}>
                        Return To Staff
                      </Button>
                      <Button
                        disabled={bucketProcessId === 'VA-ID'}
                        onClick={() => handleSubmit('SUBMIT')}
                        color="success"
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </>
              )
            ) : (
              <>
                {/* <Button onClick={handleOnSave}>
                  Save
                </Button> */}
                {/* {!viewOnly && ( */}
                <>
                  <Button variant="outlined" onClick={() => handleSubmit('RETURN_TO_STAFF')}>
                    Return To Staff
                  </Button>
                  <Button
                    disabled={bucketProcessId === 'VA-ID'}
                    onClick={() => handleSubmit('SUBMIT')}
                    color="success"
                  >
                    Submit
                  </Button>
                </>
                {/* )} */}
              </>
            )}


          </>
        );} else {
        return (
          <>
            <Button variant="outlined" onClick={() => handleCancel()}>
              Close
            </Button>
            <Button onClick={handleNext}>
              Next
            </Button>
          </>);
      }
    }
    // Jika peran adalah isStaff dan bukan isStaffDkhi
    else if (!isDetail && isStaff && !isStaffDkhi && !isMaker && !isChecker) {
      const showSaveSubmit = !isApproval && !isActivation;

      return (
        <>


          {(isCreation || isReturnStaff) && showSaveSubmit && (
            <>
              {!viewOnly && (
                <Button
                  disabled={bucketProcessId === 'VA-ID'}
                  variant="outlined"
                  color="error"
                  onClick={handleOnCancelProcess}
                >
                  Cancel
                </Button>
              )}
            </>
          )}
          <Button variant="outlined" onClick={handleCancel}>
            Close
          </Button>
          {(isCreation || isReturnStaff) && showSaveSubmit && (
            <>
              {!viewOnly && (
                <Button
                  disabled={bucketProcessId === 'VA-ID'}
                  onClick={() => handleSubmit('SUBMIT')}
                  color="success"
                >
                  Submit
                </Button>
              )}
            </>
          )
          // : (
          //   <Button onClick={handleNext}>
          //     Next
          //   </Button>
          // )
          }
        </>
      );
    }
    else if (!isDetail && isMaker && !isStaff && !isStaffDkhi && !isSuperAdmin && !isChecker) {
      const showSaveSubmit = !isApproval && !isActivation;

      return (
        <>

          {(isApproval || isApprovalChecker) && (
            <>
              <Button variant="outlined" color="error" onClick={() => handleDecline()}>
                Decline
              </Button>
              <Button variant="outlined" onClick={() => handleCommenctVa()}>
                Comment
              </Button>
              <Button variant="outlined" onClick={() => handleSubmit(isApproval ? 'RETURN_TO_STAFF' : 'RETURN_TO_MAKER')}>
                Return To {isApproval ? 'Staff' : 'Maker'}
              </Button>
              <Button
                disabled={bucketProcessId === 'VA-ID'}
                onClick={() => handleSubmit('SUBMIT')}
                color="success"
              >
                Approve
              </Button>
            </>
          )}

          {(isCreation || isReturnMaker) && showSaveSubmit && (
            <>
              {!viewOnly && (
                <>
                  <Button
                    disabled={bucketProcessId === 'VA-ID'}
                    variant="outlined"
                    onClick={handleOnCancelProcess}
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    Close
                  </Button>
                  <Button
                    disabled={bucketProcessId === 'VA-ID'}
                    onClick={() => handleSubmit('SUBMIT')}
                    color="success"
                  >
                    Submit
                  </Button>
                </>
              )}
            </>
          )}


          {/* {(isCreation || isReturnMaker) && showSaveSubmit && (
            <>
              {!viewOnly && (
                <Button
                  disabled={bucketProcessId === 'VA-ID'}
                  onClick={() => handleSubmit('SUBMIT')}
                  color="success"
                >
                  Submit
                </Button>
              )}
            </>
          )} */}
        </>
      );
    }
    else if (!isDetail && (isKadiv || isChecker)) {
      return (
        <>
          <Button variant="outlined" onClick={() => handleCommenctVa()}>
            Comment
          </Button>
          <Button onClick={handleNext}>
            Next
          </Button>
        </>
      );
    }
    else if (isChecker || isStaff && isStaffDkhi) {
      return (
        <>
          <Button variant="outlined" onClick={() => handleCancel()}>
            Close
          </Button>
          <Button onClick={handleNext}>
            Next
          </Button>
        </>
      );
    }
    else if (isDetail) {
      return (
        <Button onClick={handleNext}>
          Next
        </Button>
      );
    }
    else {
      return (
        <Button onClick={handleNext}>
          Next
        </Button>
      );
    }
  };

  return (
    <ColumnWrapper sx={{ gap: 3, mt: 4 }}>
      <RowWrapper justifyContent="space-between" mb={2}>
        <Title title="VA List" />
        {(isPathActivation && (isMaker || isChecker || (isStaff && isStaffDkhi))) ? (
          <RowWrapper mb={2} gap={3}>
            <Button color="error" onClick={() => handleNonActive()} disabled={!isAnyItemSelected || isActivation}>
              Non Active
            </Button>
            <Button color="success" onClick={() => handleActive()} disabled={!isAnyItemSelected}>
              Active
            </Button>
          </RowWrapper>
        ) : canAddVa && !isDetail && !viewOnly ? (
          <Button disabled={ (isApproval || isApprovalChecker) && (isStaff || isMaker) || isActivation} startIcon="add" onClick={() => NiceModal.show(modal.ADD_EDIT_VA, { action: 'Add' })}>
            Add New VA
          </Button>
        ) : null}
      </RowWrapper>

      {/* Table Request Virtual Account */}
      <SectionTitle isOpen={true} title="Request Virtual Account">
        <Box width="45vw">
          <Input
            type="search4"
            value={filterRequest}
            onChange={setFilterRequest}
            placeholder="Pencarian..."
            contentList={filterContentListRequest}
            dropdownList={filterDropdownList}
          />
        </Box>
        <Table
          isPaper
          tableHeader={tableHeaderRequest}
          tableData={tableDataRequest}
          currentPage={noPageRequest}
          handlePageChange={setNoPageRequest}
          onPageSizeChange={setItemPerPageRequest}
          totalPage={tablePageRequest?.totalPage ?? 1}
          isLoading={isLoadingRequest}
        />
      </SectionTitle>

      {/* Table Current Virtual Account */}
      <SectionTitle isOpen={true} title="Current Virtual Account">
        <Box width="45vw">
          <Input
            type="search4"
            value={filterCurrent}
            onChange={setFilterCurrent}
            placeholder="Pencarian..."
            contentList={filterContentListCurrent}
            dropdownList={filterDropdownList}
          />
        </Box>
        <Table
          isPaper
          tableHeader={tableHeaderCurrent}
          tableData={tableDataCurrent}
          currentPage={noPageCurrent}
          handlePageChange={setNoPageCurrent}
          onPageSizeChange={setItemPerPageCurrent}
          totalPage={tablePageCurrent?.totalPage ?? 1}
          isLoading={isLoadingCurrent}
        />
      </SectionTitle>

      {/* Table Previous Virtual Account */}
      <SectionTitle isOpen={true} title="Previous Virtual Account">
        <Box width="45vw">
          <Input
            type="search4"
            value={filterPrevious}
            onChange={setFilterPrevious}
            placeholder="Pencarian..."
            contentList={filterContentListPrevious}
            dropdownList={filterDropdownList}
          />
        </Box>
        <Table
          isPaper
          tableHeader={tableHeaderPrevious}
          tableData={tableDataPrevious}
          currentPage={noPagePrevious}
          handlePageChange={setNoPagePrevious}
          onPageSizeChange={setItemPerPagePrevious}
          totalPage={tablePagePrevious?.totalPage ?? 1}
          isLoading={isLoadingPrevious}
        />
      </SectionTitle>

      <RowWrapper sx={{ gap: 3, justifyContent: 'end' }}>
        {renderButtons()}
      </RowWrapper>
      <ModalDef id={modal.ADD_EDIT_VA} component={AddEditVA} />
      <ModalDef id={modal.DECLINE} component={ModalDecline} />
    </ColumnWrapper>
  );
};

export default DetailListPage;
