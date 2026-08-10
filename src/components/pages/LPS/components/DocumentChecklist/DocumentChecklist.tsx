'use client';


import { TypeModule, TypeProcess } from '@/enums/Module';


import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ConfirmationInfo from '../ConfirmationInfo';
import ConfirmationLatest from '../ConfirmationLatest/ConfirmationLatest';
import TableHistoryBast from '../TableHistoryBast';

import useDocumentChecklist from './DocumentChecklist.hook';

import type { DocumentChecklistProps } from './DocumentChecklist.types';


const DocumentChecklist = (props: DocumentChecklistProps) => {
  const {
    TABLE_HEADER_DIGITAL_MEMO,
    TABLE_HEADER_FINANCE,
    TABLE_HEADER_SUPPORT,
    viewOnly,
    digitalMemoData,
    digitalMemoList,
    financingData,
    financingList,
    supportingData,
    supportingList,
    isAutoSaveFetching,
    isLoadingFinancing,
    isLoadingMemo,
    isLoadingSupporting,
    isResetting,
    handleSave,
    isSaveLoading,
    checkBtnHideGenerateBast,
    memoFilter,
    setMemoFilter,
    memoFilterContentList,
    financingFilter,
    setFinancingFilter,
    financingFilterContentList,
    supportingFilter,
    setSupportingFilter,
    supportingFilterContentList,
    searchByOptions,
    memoPage,
    setMemoPage,
    setMemoItemPerPage,
    financingPage,
    setFinancingPage,
    setFinancingItemPerPage,
    supportingPage,
    setSupportingPage,
    setSupportingItemPerPage,
    isDpopDivision,
  } = useDocumentChecklist(props);

  // viewOnly DiHide
  const button = viewOnly ? [] : checkBtnHideGenerateBast().button;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDpopDivision && (
        <ConfirmationLatest />
      )}
      <Title title="Document Checklist" />

      {(props.lpsType === 'bast' && !isDpopDivision) &&
        <ConfirmationInfo
          notice="Dokumen melalui modul LPS BAST hanya dapat dikirim satu kali ke Document System.
       Mohon dipastikan seluruh dokumen yang diperlukan telah sesuai dan lengkap sebelum dikirim oleh tim Operasional."
        />}
      <SectionTitle title="Digital Memo" isOpen>
        <Search
          value={memoFilter}
          isDebounced
          hasFilter
          onChange={setMemoFilter}
          placeholder="Pencarian..."
          dropdownList={searchByOptions}
          contentList={memoFilterContentList}
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoadingMemo || isResetting}
            tableHeader={TABLE_HEADER_DIGITAL_MEMO}
            tableData={digitalMemoList}
            currentPage={memoPage}
            totalPage={digitalMemoData?.page?.totalPage}
            handlePageChange={setMemoPage}
            onPageSizeChange={setMemoItemPerPage}
          />
        </BaseContainer>
      </SectionTitle>
      <SectionTitle title="Document Pembiayaan" isOpen>
        <Search
          value={financingFilter}
          isDebounced
          hasFilter
          onChange={setFinancingFilter}
          placeholder="Pencarian..."
          dropdownList={searchByOptions}
          contentList={financingFilterContentList}
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoadingFinancing || isResetting}
            tableHeader={TABLE_HEADER_FINANCE}
            tableData={financingList}
            currentPage={financingPage}
            totalPage={financingData?.page?.totalPage}
            handlePageChange={setFinancingPage}
            onPageSizeChange={setFinancingItemPerPage}
          />
        </BaseContainer>
      </SectionTitle>

      <SectionTitle title="Supporting Document" isOpen>
        <Search
          value={supportingFilter}
          isDebounced
          hasFilter
          onChange={setSupportingFilter}
          placeholder="Pencarian..."
          dropdownList={searchByOptions}
          contentList={supportingFilterContentList}
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoadingSupporting || isResetting}
            tableHeader={TABLE_HEADER_SUPPORT}
            tableData={supportingList}
            currentPage={supportingPage}
            totalPage={supportingData?.page?.totalPage}
            handlePageChange={setSupportingPage}
            onPageSizeChange={setSupportingItemPerPage}
          />
        </BaseContainer>
      </SectionTitle>
      <TableHistoryBast
        id={String(props.id)}
        process={TypeProcess.LPS_BAST}
        module={TypeModule.LPS}
        buttons={button as never}
        // viewOnly di Hide
        hideBtnAdd={checkBtnHideGenerateBast().isHideAddNew || viewOnly}
      />
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3, py: 3 }}>
        {!viewOnly && (
          <Button
            onClick={() => handleSave(false)}
            isLoading={isSaveLoading || isResetting}
            disabled={isAutoSaveFetching || isResetting}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        )}
        {(props.lpsType === 'core' && !viewOnly) && props.renderAction()}
        {props.lpsType === 'bast' && (
          <Button
            onClick={() => handleSave(true)}
            isLoading={isSaveLoading || isResetting}
            disabled={isResetting}
          >
            Next
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper >
  );
};

export default DocumentChecklist;
